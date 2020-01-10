import registerUpload from './upload'
import registerPostgres from './postgres'

export default (server: any) => {
  registerUpload(server)
  registerPostgres(server)
}
