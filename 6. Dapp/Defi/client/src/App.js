import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
// import Card from "react-bootstrap/Card;


import "./App.css";

class App extends Component {
  state = { proposals: [], whiteList: [], totalVoter:0, wfStatus:0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.init);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  init = async () => {
    const { contract } = this.state;

    //Récupération variables publics
    const _totalVoter = await contract.methods.totalVoter().call();
    const _wfStatus =  await contract.methods.wfStatus().call();
    //const _proposals = await contract.methods.getProposals().call();
        
    //Màj state de l'App
    this.setState({totalVoter:_totalVoter, wfStatus:_wfStatus});//, proposals:_proposals});
  }


  registeringUniqueAd = async () => {
    const { accounts, contract, whitelist } = this.state;
    //let voterToregistred = "0x39A361F8a64A025d70E9E8c80413dc7d6721D0c3";
    let voterToregistred = "0x39A361F8a64A025d70E9E8c80413dc7d6721D0c3";
    await contract.methods.registeringUniqueAd(voterToregistred).send({ from: accounts[0] });
    whitelist.push(voterToregistred);
    this.setState({ whitelist: whitelist});
  };


 
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
            <h2 className="text-center">Système d'une liste blanche</h2>
            <hr></hr>
            <br></br>
        </div>
        <div>The nb of voter is: {this.state.totalVoter}</div>
        <div>The wf status is: {this.state.wfStatus}</div>
        {/* <Card>
          <Card.Body>This is some text within a card body.</Card.Body>
        </Card> */}
        {/* <div>The proposals are: {this.state.proposals}</div> */}
      </div>
    );
  }
}

export default App;

/* export class Workflow extends Component{
  constructor(props) {
    super(props);
    this.state = {newStatus:props.newStatus, previousStatus:props.previousStatus};
  }

    render(){
      console.log(this.props);
      console.log(this.state);
      return (
        <div className="Workflow">
          <p>Workflow status</p>
          <div>
            Status courrant : {this.state.newStatus}<br />
            Status previous : {this.state.previousStatus}
          </div>
        </div>
      );
    }
}
 */
