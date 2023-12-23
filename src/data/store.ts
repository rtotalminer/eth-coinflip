
export const Store = <Type>(initialState: Type) => {
    let state = initialState;
    const listeners = new Set<() => void>();
  
    function setState(newState: object) {
      state = {
        ...state,
        ...newState,
      };
      listeners.forEach(listener => listener());
    }
  
    function getSnapshot() {
      return state;
    }
  
    function subscribe(listener: () => void) {
      listeners.add(listener);
  
      return () => {
        listeners.delete(listener);
      };
    }
  
    // returns the snapshot used during server rendering
    function getServerSnapshot() {
      return state;
    }
 
    return {
      setState,
      getSnapshot,
      subscribe,
      getServerSnapshot,
    };
};

export const UserStore = Store({
  accounts: [],
  provider: {}
});

