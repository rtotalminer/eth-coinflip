
export default function Footer() {

  const footer : any = {
      position: 'fixed',
      left: '0',
      bottom: '0',
      width: '100%',
      height: '50px',
      backgroundColor: '#282829',
      color: 'white',
      textAlign: 'center',
      paddingTop: '15px'
  }

  return (
  <div style={footer}>
    <p><a href='#discord'>Discord</a> | <a href='#twitter'>Twitter</a></p>
  </div>
)
}