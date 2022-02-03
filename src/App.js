import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import Base from "./components/Base";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthProvider from './components/authprovider/AuthProvider'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';

const App = () => {

  const getLibrary = (provider) => {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }

  const generateClassName = createGenerateClassName({
    productionPrefix: 'c',
    disableGlobal: true
  });

  return (
    <Provider store={store}>
      <Router>
        <Web3ReactProvider getLibrary={getLibrary}>
          <AuthProvider>
          <StylesProvider generateClassName={generateClassName}>
          <Base />
          </StylesProvider>
          </AuthProvider>
        </Web3ReactProvider>
      </Router>
    </Provider>
  );
}

export default App;
