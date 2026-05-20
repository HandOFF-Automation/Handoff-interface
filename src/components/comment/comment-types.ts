export type CommentMessage = {
  id: string
  authorName: string
  authorAvatar: string
  text: string
  createdAt: number
}

export type CommentThread = {
  id: string
  x: number
  y: number
  createdBy: string
  createdAt: number
  messages: CommentMessage[]
  isTyping?: boolean
}

export type CanvasView = {
  x: number
  y: number
  scale: number
}
