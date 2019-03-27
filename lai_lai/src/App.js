import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';

import Home from './components/Home'
import ModalConductor from './helpers/ModalConductor'
import Snackbar from './helpers/Snackbar'

import './App.css';

const history = createBrowserHistory()
let snackbarTimer

class App extends Component {
  constructor(){
    super()

    this.state = {
      modalStatus: '',
      modalName: '',
      modalProps: null,
      snackbarStatus: '',
      snackbarProps: {},
    }
    this.setModal=this.setModal.bind(this)
  }

  setModal(modalStatus, modalName, modalProps) {
    if (modalStatus === 'hide') {
      this.setState({
        modalStatus: '',
        modalName: '',
        modalProps: null,
      })
    }
    else {
      this.setState({
        modalStatus: modalStatus,
        modalName: modalName,
        modalProps: modalProps,
      })
    }
  }

  setSnackbar(snackbarStatus, snackbarProps) {
    if (snackbarStatus === 'show') {
      clearTimeout(snackbarTimer)
      this.setState({snackbarStatus: 'hide'},() => {
        let animationDuration = 3000
        if (snackbarProps) {
          if (snackbarProps.duration) animationDuration = snackbarProps.duration
        }
        this.setState({snackbarStatus: 'show', snackbarProps: snackbarProps ? snackbarProps : {}},() => {
          snackbarTimer = setTimeout(() => {
            this.setState({snackbarStatus: 'hide'})
          }, animationDuration)
        })
      })
    }
  }

  render() {
    return (
      <Router  history={history}>
        <div className="default">
          <ModalConductor
            modalName={this.state.modalName}
            modalStatus={this.state.modalStatus}
            modalProps={this.state.modalProps}
            setModal={this.setModal}
            setSnackbar={this.setSnackbar}
          />
          <Snackbar
            snackbarStatus={this.state.snackbarStatus}
            snackbarProps={this.state.snackbarProps}
          />
          <Route exact path="/" render={() => (
            <Home
              setModal={this.setModal}
              setSnackbar={this.setSnackbar}
              history={history}
            />
          )} />
        </div>
      </Router>
    );
  }
}

export default App;
