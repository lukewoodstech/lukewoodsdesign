import Link from 'next/link'

type Project = {
  title: string
  href?: string
  bg: string
  accent?: string
}

const projects: Project[] = [
  {
    title: 'project one',
    href: '#',
    bg: 'linear-gradient(135deg, #008fff18, #008fff38)',
    accent: '#008fff',
  },
  {
    title: 'project two',
    href: '#',
    bg: 'linear-gradient(135deg, #ff537a18, #ff537a38)',
    accent: '#ff537a',
  },
  {
    title: 'project three',
    href: '#',
    bg: 'linear-gradient(135deg, #00ffb518, #00ffb538)',
    accent: '#00ffb5',
  },
  {
    title: 'project four',
    href: '#',
    bg: 'linear-gradient(135deg, #ffb3ff18, #ffb3ff38)',
    accent: '#ffb3ff',
  },
  {
    title: 'project five',
    href: '#',
    bg: 'linear-gradient(135deg, #ffffb518, #ffffb538)',
    accent: '#ffffb5',
  },
  {
    title: 'coming soon',
    bg: 'linear-gradient(135deg, #0d0d14, #12121c)',
  },
]

function GridItem({ project }: { project: Project }) {
  const inner = (
    <div className="workgrid__item__container">
      <div className="workgrid__item__content" style={{ background: project.bg }}>
        {project.accent && (
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: project.accent,
              opacity: 0.12,
              filter: 'blur(18px)',
            }}
          />
        )}
      </div>
      <div className="workgrid__item__title">{project.title}</div>
    </div>
  )

  return (
    <div className="workgrid__item">
      {project.href ? <Link href={project.href}>{inner}</Link> : inner}
    </div>
  )
}

export default function WorkGrid() {
  return (
    <div className="workgrid">
      {projects.map((p, i) => (
        <GridItem key={i} project={p} />
      ))}
    </div>
  )
}
