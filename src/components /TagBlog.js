import { collection, getDocs, query, where } from 'firebase/firestore';
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase';
import BlogSection from './BlogSection';
import Spinner from './Spinner'


const TagBlog = () => {
    const [tagBlogs, setTagBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const{tag} = useParams();

    const getTagBlogs = async() => {
        setLoading(true);
        const blogRef = collection(db, "blogs");

        const tagBlogQuery = query(blogRef, where("tags", "array-contains", tag));
        const docSnapshot = await getDocs(tagBlogQuery);
        let tagBlogs = [];
        docSnapshot.forEach((doc) => {
          tagBlogs.push({id: doc.id, ...doc.data()});
        })

        setTagBlogs(tagBlogs)
        setLoading(false)
    }

    useEffect(()=>{
      getTagBlogs();
    },[])

    if(loading){
      return<Spinner />
    }
  return (
    <div>
      <div className='container'>
        <div className='row'>
        <div className='blog-heading text-start py-2 mb-4'> 
        With Tag : <strong>{tag.toLocaleUpperCase()}</strong>
        </div>
        {tagBlogs?.map((item) => (
          <div className='col-md-6'>
            <BlogSection key={item.id}{...item}/>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default TagBlog