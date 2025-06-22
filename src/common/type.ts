export type LabelAndValue = {
  label: string
  value: string
}

export type Loading = 'NotLoad' | 'Loaded' | 'Loading' | 'Error'

export type DialogState = 'add' | 'edit' | 'view' | 'none'

// Define types for Item and WebSocketMessage
export interface WebSocketMessage<T> {
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'DELETE_LIST'
  item: T
}
