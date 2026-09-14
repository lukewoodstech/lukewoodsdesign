'use client'

import { Children, isValidElement, type ReactNode } from 'react'
import Link from 'next/link'
import ReactMarkdown, { type Components } from 'react-markdown'

/*
 * The one renderer for Luke AI answers, in both the homepage terminal and
 * /chat. Answers are prose, so they set in the site's sans (see .lai__prose
 * in globals.css) while the terminal around them stays monospace. Links:
 * site routes navigate in place through next/link; mail opens the client;
 * everything else opens a new tab.
 */

const isInternal = (href: string) => href.startsWith('/') && !href.startsWith('//')

/*
 * Bold is for a label or a name, never a paragraph. A short bold-only
 * line (`**Why it matters**`) is a section label and stays; a whole
 * sentence the model wrapped in ** is unwrapped and set as plain prose.
 */
const LABEL_MAX = 48

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

/* A bold run longer than a name, a number, or a short phrase is the
   model bolding an explanation; set it as plain text instead. */
function Strong({ children }: { children?: ReactNode }) {
  return textOf(children).length > LABEL_MAX ? <>{children}</> : <strong>{children}</strong>
}

function Paragraph({ children }: { children?: ReactNode }) {
  const kids = Children.toArray(children)
  if (kids.length === 1) {
    const only = kids[0]
    if (
      isValidElement<{ children?: ReactNode }>(only) &&
      only.type === 'strong' &&
      textOf(only).length > LABEL_MAX
    ) {
      return <p>{only.props.children}</p>
    }
  }
  return <p>{children}</p>
}

const components: Components = {
  p: Paragraph,
  strong: Strong,
  a: ({ href = '', children }) => {
    if (isInternal(href) && !href.endsWith('.pdf')) {
      return (
        <Link href={href} className="lai__route">
          {children}
        </Link>
      )
    }
    const isMail = href.startsWith('mailto:')
    return (
      <a
        href={href}
        target={isMail ? '_self' : '_blank'}
        rel={isMail ? undefined : 'noopener noreferrer'}
      >
        {children}
      </a>
    )
  },
  /* Headings inside an answer read as section labels, never as page
     titles — the answer lives inside a terminal window. */
  h1: ({ children }) => <p className="lai__label">{children}</p>,
  h2: ({ children }) => <p className="lai__label">{children}</p>,
  h3: ({ children }) => <p className="lai__label">{children}</p>,
  h4: ({ children }) => <p className="lai__label">{children}</p>,
  /* Raw HTML is never rendered; images have no place in an answer. */
  img: () => null,
}

export default function LukeAiMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown components={components} skipHtml>
      {children}
    </ReactMarkdown>
  )
}
