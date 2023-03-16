import { render, renderHook, screen } from '@testing-library/react';
import { it, describe, expect } from 'vitest';
import { BrowserRouter, createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../routes/Home';
import Test from '../routes/Test';
import LoadingInfoContext from '../contexts/LoadingInfoContext';
import usePodcasts from '../hooks/usePodcasts';

describe('App', () => {
  it('renders headline', () => {
    
    const test = () => {}
    const wrapper = ({children}) => <LoadingInfoContext>{children}</LoadingInfoContext>;
    const {podcastsInfo} = renderHook(() => usePodcasts(), {wrapper});

    render(
      <LoadingInfoContext.Provider value={[false, test]}>
        <BrowserRouter>
        <Home />
        </BrowserRouter>
      </LoadingInfoContext.Provider>
    );
    screen.debug();

    // check if App components renders headline
  });
});
