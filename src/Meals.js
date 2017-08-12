import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';

// Components
import Card from './Card.js';

class Meals extends Component {

  constructor(props) {
    super();
    this.state = props.data;
    //this.state.editing = false;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const mealsRef = firebase.database().ref('meals');
    mealsRef.on('value', (snapshot) => {
      let meals = snapshot.val();
      let newState = [];
      for (let meal in meals) {
        newState.push({
          breakfast: meal.breakfast
        });
      }

      this.setState({
        meals: newState
      });
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const mealsRef = firebase.database().ref('meals');
    const meal = {
      mealLocation: this.state.mealLocation,
      mealname: this.state.mealname,
      cardCreator: this.state.user.displayName
    }
    mealsRef.push(meal);
    this.setState({
      mealLocation: '',
      mealname: ''
    });
  }

  render() {
    console.log(this.state);
    return (
      <div className='main-box'>
        <div className='row'>
          <section className='sidebar col m3 white-text'>
            <form onSubmit={this.handleSubmit}>
              <input type="text" name="mealname" placeholder="Name" onChange={this.handleChange} value={this.state.mealname} />
              <input type="text" name="mealItem" placeholder="Item" onChange={this.handleChange.bind(this)} value={this.state.mealItem} />
              <button className="btn">Add Meal</button>
            </form>
          </section>
          <section className='col m9'>
            <div className='card-wrapper row'>
              <div className="">
                {this.state.meals.map((meal) => {
                  return (
                    <Card key={meal.id} user={this.state.user} content={meal} />
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default Meals;