import React, {useState, useEffect} from 'react'

const ScrollToTop = () => {
    const[isVisible, setIsVisible] = useState(false);
    const toggleVisibilty = () => {
        if(window.pageYOffset>200){
            setIsVisible(true)
        } else{
            setIsVisible(false)
        }
    }

    const ScrollToTop = () =>{
        window.scrollTo({
            top:0,
            behavior:"smooth"
        })
    }

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibilty);
        return()=> {
            window.removeEventListener("scroll", toggleVisibilty)
        }

    }, [])

  return (
    <div className='scroll-to-top'>
        {isVisible && (
            <span onClick={ScrollToTop}>
                <i className='fa fa-arrow-up' />
            </span>
        )}

    </div>
  )
}

export default ScrollToTop