import { getAllConvos } from '@/app/actions'
import Link from 'next/link'

export interface SidebarListProps {
  userId?: string
}

export async function SidebarList({ userId }: SidebarListProps) {
  const convos = await getAllConvos()

  return (
    <div className="flex-1 overflow-auto">
      {convos.map(convo => {
        return (
          <p key={convo} className="px-2 py-1 text-xs text-muted-foreground">
            <Link href={`/editor/${convo}`}>{convo}</Link>
          </p>
        )
      })}
    </div>
  )
}
