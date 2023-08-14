import { getAllConvos } from '@/app/actions'

export interface SidebarListProps {
  userId?: string
}

export async function SidebarList({ userId }: SidebarListProps) {
  const convos = await getAllConvos()

  return (
    <div className="flex-1 overflow-auto">
      {convos.map(convo => (
        <p key={convo} className="px-2 py-1 text-xs text-muted-foreground">
          {convo.replace('convos/', '').replace('-data.json', '').split('-')[1]}
        </p>
      ))}
    </div>
  )
}
