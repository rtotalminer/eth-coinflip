
export default function Footer() {

  const footer : any = {
      position: 'fixed',
      left: '0',
      bottom: '0',
      width: '100%',
      height: '50px',
      backgroundColor: '#282829',
      color: 'white',
      textAlign: 'center'
  }

  return (
  <div style={footer}>
    <p><a>Discord</a> | <a>Twitter</a></p>
  </div>
)
}