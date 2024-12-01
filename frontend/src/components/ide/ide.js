import './ide.css'

const Ide = () => {
    return (
        <div className='ide_section'>
            <div className='ide_content'>
                <iframe
                    src="https://coderush.vercel.app"
                    title="Coderush"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    scrolling="no"
                />
            </div>
            <div className='floatt'></div>
            <div className='floatt2'></div>
            <div className='floatt3'></div>
        </div>
    )
}

export default Ide;