import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Searchbar from './components/Searchbar/Searchbar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import ApiService from './services/ApiService';
import Button from './components/Button/Button';
import Loader from './components/Loader/Loader';
import Modal from './components/Modal/Modal';
import Error from './components/Error/Error';

export default function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  useEffect(() => {
    if (!query) return;

    const fetchImages = async () => {
      try {
        const request = await ApiService(query, page);
        if (request.length === 0) {
          setError(`No results were found for ${query}!`);
        }

        setImages([...images, ...request]);

        if (request.length >= 12) {
          setShowLoadMoreBtn(true);
        } else {
          setShowLoadMoreBtn(false);
        }
      } catch (error) {
        setError('Something went wrong. Try again.');
      } finally {
        setIsLoading(false);

        if (images.length > 12) {
          onScroll();
        }
      }
    };

    fetchImages();
  }, [page, query]);

  const searchImgs = newQuery => {
    if (query === newQuery) return;

    setQuery(newQuery);
    setImages([]);
    setPage(1);
    setError(null);
    setIsLoading(true);
  };

  const onLoadMore = () => {
    setIsLoading(true);
    setPage(page + 1);
  };

  const onScroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const onOpenModal = e => {
    setLargeImageURL(e.target.dataset.source);
    setShowModal(true);
  };

  return (
    <div className="App">
      <Searchbar onHandleSubmit={searchImgs} />

      {error && <Error texterror={error} />}

      {images.length > 0 && (
        <ImageGallery images={images} onOpenModal={onOpenModal} />
      )}

      {isLoading && <Loader />}

      {showLoadMoreBtn && <Button onLoadMore={onLoadMore} />}

      {showModal && (
        <Modal
          onCloseModal={() => setShowModal(false)}
          largeImageURL={largeImageURL}
        />
      )}

      <ToastContainer autoClose={4000} />
    </div>
  );
}
