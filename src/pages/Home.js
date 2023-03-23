import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import React, {useState, useEffect} from 'react'
import BlogSection from '../components /BlogSection';
import Spinner from '../components /Spinner';
import { db } from '../firebase';
import {toast} from "react-toastify"
import Tags from '../components /Tags';
import FeatureBlogs from '../components /FeatureBlogs';
import Trending from '../components /Trending';
import Slider from '../components /Slider';
import './../parallax.css';
import Search from '../components /Search';
import { isEmpty} from 'lodash';
import { useLocation } from 'react-router-dom';
import { isNull } from 'lodash';
import { async } from '@firebase/util';
import Category from '../components /Category';


function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Home = ({setActive, user, active}) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [lastVisible, setLastVisible] = useState(null)
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(null);
  const [hide, setHide] = useState(false);
  const queryString = useQuery();
  const searchQuery = queryString.get("searchQuery");
  const location = useLocation();

  const getTrendingBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const trendQuery = query(blogRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    let trendBlogs = [];
    querySnapshot.forEach((doc) => {
      trendBlogs.push({id: doc.id, ...doc.data()})
    });

    setTrendBlogs(trendBlogs);
  }

  useEffect(() => {
    getTrendingBlogs();
    setSearch("")
    const unsub = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        let tags =[];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get("tags"));
          list.push({id: doc.id, ...doc.data()})
        }
        
        )
        const uniqueTags =[...new Set(tags)];
        setTags(uniqueTags);
        setTotalBlogs(list);
        // setBlogs(list);
        setLoading(false);
        setActive("home")
      },
      (error) => {
        console.log(error)
      }
    );

    
    return() =>{
      unsub();
      getTrendingBlogs();
    }

    
    
  }, [setActive, active]);


  const getBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const firstFour = query(blogRef, orderBy("title"), limit(4))
    const blogsQuery = query(blogRef,orderBy("title"))
    const docSnapshot = await getDocs(firstFour);
    setBlogs(docSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data() })))
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length -1])
  }



  useEffect(() => {
    getBlogs();
    setHide(false)
  }, [active])

useEffect(() =>{
  if(!isNull(searchQuery)){
    searchBlogs();
  }
}, [searchQuery])



  if (loading){
    return <Spinner/>
  }

  const updateState = (docSnapshot) => {
    const isCollectionEmpty = docSnapshot.size === 0;
    if(!isCollectionEmpty){
      const blogData = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setBlogs((blogs) => [...blogs,...blogData])
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length -1])

    }else {
      toast.info("There are currently no more blogs to view")
      setHide(true);
    }
  }
  const fetchMore = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const nextFour = query(blogRef, orderBy("title"), limit(4), startAfter(lastVisible))
    const docSnapshot = await getDocs(nextFour)
    updateState(docSnapshot);
    setLoading(false)
  };

  const searchBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const searchTitleQuery = query(blogRef, where("title", "==", searchQuery));
    const searchTagQuery = query(blogRef, where("tags", "array-contains", searchQuery));
    const titleSnapshot = await getDocs(searchTitleQuery);
    const tagSnapshot = await getDocs(searchTagQuery);

    let searchTitleBlogs = [];
    let searchTagBlogs = [];

    titleSnapshot.forEach((doc) => {
      searchTitleBlogs.push({id: doc.id, ...doc.data()});
    })

    tagSnapshot.forEach((doc) => {
      searchTagBlogs.push({id: doc.id, ...doc.data()});
    })

    const combinedSearchBlog = searchTitleBlogs.concat(searchTagBlogs)
    setBlogs(combinedSearchBlog);
    setHide(true);
    setActive("");
  }


  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this blog?")){
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog Has Been Deleted Succesfully")
        setLoading(false)
      }
      catch(err){
        console.log(err)
      }
    }
  }






  const handleChange = (e) => {
    const {value} = e.target;
    if (isEmpty(value)) {
     getBlogs();
     setHide(false);
    }
    setSearch(value);
   }


   const counts = totalBlogs.reduce((prevValue, currentValue) => {
    let name = currentValue.category;
    if(!prevValue.hasOwnProperty(name)){
      prevValue[name] = 0;
    }
    prevValue[name]++;
    delete prevValue["undefined"];
    return prevValue;
   }, {});

   const categoryCount= Object.keys(counts).map((k) =>{
    return{
      category: k,
      count: counts [k]
    }
   })

   console.log("categoryCount", categoryCount);

  return (
    <div>
       <Slider />
   
<div className='bd'>

<div className='container-fluid pb-4 pt-4 padding'>
          
    <div className='container padding'>
      
      <div className='row mx-0'>
<div id='parallax-bg-2'>
        <Trending blogs={trendBlogs}/>
        </div>
        <div className='col-md-8'>
        <div className='blog-heading text-start py-2 mb-4'> Blogs</div>
          {blogs.length ===0 && location.pathname !=="/" &&(
            <>
            <h4>
              No Blogs Found with the Keyword <strong>{searchQuery}</strong>
            </h4>
            <h5>Try Searching with the Blog Title or Tag</h5>
            </>
          )}
          {blogs?.map((blog) => (
            <BlogSection key={blog.id} user ={user} handleDelete = {handleDelete} {...blog}/>
          ))}
          

          {!hide &&(<button className='btn btn-dark' onClick={fetchMore}>Load More...</button>)}
          
        </div>

        <div className='col-md-3'>
        <Search search={search} handleChange= {handleChange} />
        <div className='blog-heading text-start py-2 mb-4'>Tags</div>
          <Tags tags = {tags} />
          <FeatureBlogs title={"Popular"} blogs={blogs} />
          <Category catgBlogsCount ={categoryCount} />
        </div>
      </div>
    </div>
  </div>


</div>

    


  </div>
  )
}

export default Home
