export interface Response {
  statusCode: number
  body: string
}

export class JsonResponse implements Response {
  body: string

  constructor (public statusCode: number, body: any) {
    this.body = body == null ? '' : JSON.stringify(body)
  }
}
