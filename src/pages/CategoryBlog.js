import { collection, getDocs, query, where } from 'firebase/firestore';
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase';
import BlogSection from "../components /BlogSection"
// import Spinner from './Spinner'


const CategoryBlog = () => {
    const [categoryBlogs, setCategoryBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const{category} = useParams();

    const getCategoryBlogs = async() => {
        setLoading(true);
        const blogRef = collection(db, "blogs");

        const categoryBlogQuery = query(blogRef, where("category", "==", category));

        const docSnapshot = await getDocs(categoryBlogQuery);
        let categoryBlogs = [];
        docSnapshot.forEach((doc) => {
            categoryBlogs.push({id: doc.id, ...doc.data()});
        })

        setCategoryBlogs(categoryBlogs)
        setLoading(false)
    }

    useEffect(()=>{
      getCategoryBlogs();
    },[])

    // if(loading){
    //   return<Spinner />
    // }
  return (
    <div>
      <div className='container'>
        <div className='row'>
        <div className='blog-heading text-start py-2 mb-4'> 
        Category / Destination: <strong>{category.toLocaleUpperCase()}</strong>
        </div>
        {categoryBlogs?.map((item) => (
          <div className='col-md-6'>
            <BlogSection key={item.id}{...item}/>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryBlog