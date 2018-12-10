import React, { Component } from 'react';
import { DisplayTodos, CreateTodoBtn } from './Components';
import Contract from 'truffle-contract';
import TodoListContract from '../build/contracts/TodoList.json';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todoListInstance: {},
      todos: [],
      account: '',
    };
  }

  async componentDidMount() {
    /*
      GET THE WEB3 OBJECT HERE,
      INSTANTIATE SMART CONTRACT,
      GET TODOS
    */
    // console.log(window.web3);

    await this.instantiateContract();
    await this.getAccount();
    await this.getTodos();
  }

  async instantiateContract() {
    const todoList = Contract(TodoListContract);
    todoList.setProvider(window.web3.currentProvider);
    const todoListInstance = await todoList.deployed();
    this.setState({ todoListInstance });
  }

  getAccount() {
    window.web3.eth.getAccounts((err, accounts) => {
      const account = accounts[0];
      this.setState({ account });
      window.web3.eth.getBalance(account, (err, balanceInWei) => {
        const balanceInEther = window.web3.fromWei(balanceInWei).toString(10);
        console.log(account, balanceInEther);
      });
    });
  }

  async getTodos() {
    const { todoListInstance } = this.state;
    const numTodos = await todoListInstance.getTotalNumTodos.call();
    const pendingTodoPromises = [];
    for (let i = 0; i < numTodos; i++) {
      const todoPromise = todoListInstance.returnTodo.call(i);
      pendingTodoPromises.push(todoPromise);
    }
    const todos = await Promise.all(pendingTodoPromises);
    this.setState({ todos });
  }

  render() {
    const {
      todos,
      todoListInstance: { createTodo, completeTodo },
      account,
    } = this.state;

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            My Todo List!
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>My todos!</h1>
              <p>Coming directly from my smart contract</p>
              <DisplayTodos
                completeTodo={completeTodo}
                todos={todos}
                account={account}
              />
              <CreateTodoBtn createTodo={createTodo} account={account} />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
