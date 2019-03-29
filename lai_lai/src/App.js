import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';

import Home from './components/Home'
import Confirmation from './components/Confirmation'
import ModalConductor from './helpers/ModalConductor'
import Snackbar from './helpers/Snackbar'
import LoadingOverlay from './common/LoadingOverlay'
import axios from './services/axios'
import DateApi from './services/api/date'

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
      date: '',
      isLoading: false,
    }
    this.setModal=this.setModal.bind(this)
    this.getDate=this.getDate.bind(this)
    this.setSnackbar=this.setSnackbar.bind(this)
    this.changeDate=this.changeDate.bind(this)
    this.setLoadingOverlay=this.setLoadingOverlay.bind(this)
    axios.setLoadingOverlay(this.setLoadingOverlay)
  }

  componentDidMount() {
    this.getDate()
  }

  getDate() {
    DateApi.getDate()
    .then(res => {
      this.setState({date: res[0].date})
    })
    .catch(err => console.log(err))
  }

  setLoadingOverlay(state) {
    this.setState({isLoading: state})
  }

  changeDate(date) {
    let dateDict = {
      date: this.state.date,
      newDate: date
    }
    DateApi.updateDate(dateDict)
    .then(res => {
      this.setSnackbar('show', {
        text: "Date changed."
      })
      this.getDate()
    })
    .catch(err => this.setSnackbar('show', {
      text: "Could'nt change date."
    }))
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
          <LoadingOverlay
            isLoading={this.state.isLoading}
          />
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
          <Route exact path="/home" render={() => (
            <Home
              date={this.state.date}
              changeDate={this.changeDate}
              setModal={this.setModal}
              setSnackbar={this.setSnackbar}
              history={history}
            />
          )} />
        <Route exact path="/confirmation" render={() => (
            <Confirmation
              date={this.state.date}
              history={history}
              setSnackbar={this.setSnackbar}
            />
          )} />
        </div>
      </Router>
    );
  }
}

export default App;
