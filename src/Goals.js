import React, { Component } from 'react';
import './App.css';
//import { Link } from 'react-router-dom';
import { VictoryBar } from 'victory';
import { dayTotal } from './Calculations.js';
import firebase from './firebase.js';

let data = [{ name: 'a', value: 12 }]

const MealItem = ({ name, total, addMeal, mealObject, mealId, meal }) => (
    <div className="food-item white-text">
        <p>{name}</p>
        <p>{total.protein}g P</p>
        <p>{total.fat}g F</p>
        <p>{total.carbs}g C</p>
        <button onClick={() => { addMeal(mealId, meal) }}>+</button>
    </div>
);

const AddedMealItem = ({ name, total, removeMeal, mealObject, mealId, index }) => (
    <div className="food-item white-text">
        <p>{name}</p>
        <p>{total.protein}g P</p>
        <p>{total.fat}g F</p>
        <p>{total.carbs}g C</p>
        <button onClick={() => { removeMeal(mealId, index) }}>-</button>
    </div>
);

class Goals extends Component {

    constructor(props) {
        super();
        this.state = {
            meals: [],
            addedMeals: [],
            day: {},
            user: props.data.user
        };
    }

    componentWillMount() {
        this.getMeals();
        this.getAddedMeals();
    }

    getMeals() {
        const mealsRef = firebase.database().ref('meals');
        mealsRef.once('value').then((snapshot) => {
            let meals = snapshot.val();
            let newState = [];
            for (let meal in meals) {
                newState.push({
                    id: meal,
                    total: meals[meal].total,
                    mealname: meals[meal].mealname,
                });
            }

            this.setState({
                meals: newState
            });
        });
    }

    getAddedMeals = () => {
        const mealsRef = firebase.database().ref('addedMeals');
        mealsRef.once('value').then((snapshot) => {
            let meals = snapshot.val();

            // Handles when addedMeals is empty in Firebase
            if (meals == null) {
                meals = [{
                    mealname: "Add a Meal",
                    total: {
                        protein: 0,
                        carbs: 0,
                        fat: 0,
                    }
                }];

            }
            let newState = [];
            for (let meal in meals) {
                newState.push({
                    id: meal,
                    total: meals[meal].total,
                    mealname: meals[meal].mealname,
                });
            }

            let total = dayTotal(newState);

            this.setState({
                addedMeals: newState,
                totals: total
            });
        });
    }

    addMeal = (mealId, meal) => {
        const mealsRef = firebase.database().ref('addedMeals');
        mealsRef.push(meal);
        this.getAddedMeals();
    }

    removeMeal = (mealId, index) => {
        let addedMealsArray = this.state.addedMeals;
        addedMealsArray.splice(index, 1);
        const mealsRef = firebase.database().ref('addedMeals');
        mealsRef.set(addedMealsArray);
        this.getAddedMeals();

        this.setState({
            addedMeals: addedMealsArray
        })
    }

    render() {
        if (this.state.totals === undefined) {
            return (<p>Loading...</p>)
        }
        return (
            <div className="goals-grid">

                <div className="goals-main">
                    <h1>Daily Goal</h1>
                </div>

                <div className="goals-graph">
                    <div className="macro-wrapper">
                        <div className="card macro-box">
                            <h1>{this.state.totals.protein}</h1>
                            <p>Protein</p>
                        </div>
                        <div className="card macro-box">
                            <h1>{this.state.totals.fat}</h1>
                            <p>Fat</p>
                        </div>
                        <div className="card macro-box">
                            <h1>{this.state.totals.carbs}</h1>
                            <p>Carbs</p>
                        </div>
                        <div className="card macro-box">
                            <h1></h1>
                            <p>Total</p>
                        </div>
                    </div>
                    <div className="goals-graph-component">
                        {/* <h4>GRAPH</h4> */}
                        <VictoryBar
                            style={{ data: { fill: "#FF3134" } }} />
                    </div>
                </div>


                <div className="goals-foods food-block white-text">
                    <h5>{this.state.meals.map((meal, index) => {
                        return (
                            <MealItem
                                key={index}
                                mealId={meal.id}
                                addMeal={this.addMeal}
                                total={meal.total}
                                name={meal.mealname}
                                meal={meal} />
                        )
                    })}</h5>
                </div>
                <div className="goals-foods food-block white-text">
                    <h5>{this.state.addedMeals.map((meal, index) => {
                        return (
                            <AddedMealItem
                                key={index}
                                mealId={meal.id}
                                removeMeal={this.removeMeal}
                                index={index}
                                total={meal.total}
                                name={meal.mealname}
                                meal={meal} />
                        )
                    })}</h5>
                </div>
            </div>
        );
    }
}


export default Goals;