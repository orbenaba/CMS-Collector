import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import IsAuthenticaed from "./Auth/IsAuthenticated.auth";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { ID } from "./Magic/Asset.magic";

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  type: "error",
  timeout: 3000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const Context = React.createContext();

const maxID = (arr) => {
  let maxi = 0;
  for (let a of arr) {
    maxi = maxi < a[ID] ? a[ID] : maxi;
  }
  return maxi;
};

const removeFromListById = (arr, removedId) => {
  let newArr = [];
  for (let a of arr) {
    if (a[ID] !== removedId) {
      newArr.push(a);
    }
  }
  return newArr;
};

const reducer = (domainOrIps, action) => {
  switch (action.type) {
    case "REMOVE": {
      if (domainOrIps.length === 1) {
        return [];
      }
      let arr = removeFromListById(domainOrIps, action.id);
      return [...arr];
    }

    case "ADD": {
      let newId = maxID(domainOrIps) + 1;
      return [...domainOrIps, [action.payload, newId]];
    }

    case "REMOVE_ALL": {
      return [];
    }

    default: {
      return domainOrIps;
    }
  }
};

export function Provider(props) {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [domainOrIps, setDomainOrIps] = useState([]);
  const dispatch = (action) => {
    setDomainOrIps(reducer(domainOrIps, action));
  };

  const resetContext = () => {
    setUser({});
    setDomainOrIps([]);
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoaded(true);
      const result = await IsAuthenticaed();
      if (result) {
        setUser(result);
      } else {
        // history.push('/login')
      }
      setIsLoaded(false);
    }
    fetchData();
  }, []);

  // Cause "this" (without the this binding) is refred to the child component, we enfore the father (Context) to be "this"
  const handleChangeUser = (user) => {
    setUser(user);
  };

  if (isLoaded) {
    return <h1> Loading ... </h1>;
  } else
    return (
      <AlertProvider template={AlertTemplate} {...options}>
        <Context.Provider
          value={{ state: { user, isLoaded, domainOrIps, dispatch }, handleChangeUser, resetContext }}>
          {props.children}
        </Context.Provider>
      </AlertProvider>
    );
}

export const Consumer = Context.Consumer;
