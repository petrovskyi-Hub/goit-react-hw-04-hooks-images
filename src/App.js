import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Searchbar from './components/Searchbar/Searchbar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import ApiService from './services/ApiService';
import Button from './components/Button/Button';
import Loader from './components/Loader/Loader';
import Modal from './components/Modal/Modal';
import Error from './components/Error/Error';

class App extends Component {
  state = {
    searchQuery: '',
    query: '',
    images: [],
    page: 1,
    error: null,
    showLoadMoreBtn: false,
    isLoading: false,
    showModal: false,
    largeImageURL: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.images.length > 12) {
      this.onScroll();
    }

    if (prevState.query !== this.state.query) {
      this.setState({
        images: [],
        page: 1,
        error: null,
        showLoadMoreBtn: false,
      });
    }
  }

  handleChange = e => {
    this.setState({ query: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.searchImgs();
  };

  searchImgs = async () => {
    const { query, page, showLoadMoreBtn } = this.state;

    if (query.trim() === '') {
      return toast.info('😱 Please enter a value for search images!');
    }

    this.toggleLoader();

    try {
      const request = await ApiService(query, page);
      this.setState(({ images, page }) => ({
        images: [...images, ...request],
        page: page + 1,
      }));

      if (request.length === 0) {
        this.setState({ error: `No results were found for ${query}!` });
      }

      if (!showLoadMoreBtn && request.length === 12) {
        this.setState({
          showLoadMoreBtn: true,
        });
      }

      if (showLoadMoreBtn && request.length < 12) {
        this.setState({
          showLoadMoreBtn: false,
        });
      }
    } catch (error) {
      this.setState({ error: 'Something went wrong. Try again.' });
    } finally {
      this.toggleLoader();
    }
  };

  onLoadMore = () => {
    this.searchImgs();
  };

  onScroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  onOpenModal = e => {
    this.setState({ largeImageURL: e.target.dataset.source });
    this.toggleModal();
  };

  toggleLoader = () => {
    this.setState(({ isLoading }) => ({
      isLoading: !isLoading,
    }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const {
      images,
      query,
      showLoadMoreBtn,
      isLoading,
      showModal,
      largeImageURL,
      error,
    } = this.state;

    return (
      <div className="App">
        <Searchbar
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          value={query}
        />

        {error && <Error texterror={error} />}

        {images.length > 0 && (
          <ImageGallery images={images} onOpenModal={this.onOpenModal} />
        )}

        {isLoading && <Loader />}

        {showLoadMoreBtn && <Button onLoadMore={this.onLoadMore} />}

        {showModal && (
          <Modal
            onToggleModal={this.toggleModal}
            largeImageURL={largeImageURL}
          />
        )}

        <ToastContainer autoClose={4000} />
      </div>
    );
  }
}

export default App;
