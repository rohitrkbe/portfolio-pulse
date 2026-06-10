'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { hydrateAuthThunk } from '@/store/thunks/authThunks';

export default function StoreProvider({ children }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      // Rehydrate auth session from localStorage on first mount
      store.dispatch(hydrateAuthThunk());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
