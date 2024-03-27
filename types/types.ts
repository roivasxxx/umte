export type RequestUtilsBody =
    | {
          body: object
          method: 'POST' | 'PATCH' | 'PUT'
      }
    | {
          body?: undefined | null
          method: 'GET' | 'DELETE'
      }
