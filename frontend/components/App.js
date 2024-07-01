import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';
import axios from 'axios';
import { axiosWithAuth } from '../axiosWithAuth';

// const articlesUrl = 'http://localhost:9000/api/articles';
// const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate ('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    localStorage.clear();
    setMessage('Goodbye!')
    redirectToLogin();
    
  }

  const login = async ({ username, password }) => {
    const { data } = await axios.post('http://localhost:9000/api/login', {username, password});
    setMessage(data.message);
    localStorage.setItem('token', data.token);
    redirectToArticles(); 
  }

  const getArticles = async () => {
    setMessage('');
    setSpinnerOn(true);
     try {
      const { data } = await axiosWithAuth().get(
        'http://localhost:9000/api/articles'
        
      );

// ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!

      setMessage(data.message);
      setArticles(data.articles);
      console.log(articles);
      const indexOfArticle = articles.indexOf(article => article.article_id === data.article.article_id);
      console.log(indexOfArticle);
     } catch (e) {
       logout();
     }
     setSpinnerOn(false);
  
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = async (article) => {
   setMessage('');
   setSpinnerOn(true);
   try {
    const { data } = await axiosWithAuth().post(
      'http://localhost:9000/api/articles',
      article
    );
    setMessage(data.message);
    setArticles([...articles, data.article])
   } catch (e) {
     logout();
   }
   setSpinnerOn(false);
   setCurrentArticleId(null);
   
  };

  const updateArticle = async ({ article_id, article }) => {
    setMessage('');
    setSpinnerOn(true);
    try {
     const { data } = await axiosWithAuth().put(
       `http://localhost:9000/api/articles/${article_id}`,
       article
     );
     setMessage(data.message);
     const indexOfArticle = articles.findIndex(article => article.article_id === data.article.article_id);
     const articlesCopy = [...articles];
     articlesCopy[indexOfArticle] = data.article;
     setArticles(articlesCopy);
    } catch (e) {
      logout();
    }
    setSpinnerOn(false);
    setCurrentArticleId(null);
  }

  const deleteArticle = async (article_id) => {
    setMessage('');
    setSpinnerOn(true);
    const { data } = await axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`);
    
    setMessage(data.message);
    setSpinnerOn(false);
    setArticles(articles.filter(article => article.article_id !== article_id))
  };
  
  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm updateArticle={updateArticle} 
              postArticle={postArticle} 
              currentArticle={articles.find(art => art.article_id === currentArticleId )} 
              setCurrentArticleId={setCurrentArticleId} />
              <Articles deleteArticle={deleteArticle} 
              setCurrentArticleId={setCurrentArticleId} 
              currentArticleId={currentArticleId} 
              articles={articles} getArticles={getArticles} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}







