import React from 'react'

const UserComments = ({name, body, createdAt, msg}) => {
  return (
    <div>
        <div className='row'>
            <div className='col-lg-12'>
                <div className='media'>
                    {msg ? (<h4>{msg}</h4>):(
                        
                        <>
                            <div className='media-left'>
                                <img src='https://cdn-icons-png.flaticon.com/256/10105/10105278.png'
                                alt='user'
                                className='rounded-circle'
                                style={{width: '30%'}}
                                
                                />
                                    <div className='media-body'>
                                        <h3 className='text-start media-heading user_name'>
                                            {name} <small>{createdAt.toDate().toDateString()}</small>
                                        </h3>
                                            <p className='text-start'>{body}</p>
                                    </div>
                            </div>
                        
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserComments