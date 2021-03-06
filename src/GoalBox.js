import React, { Component } from 'react';
import './App.css';
import firebase, { getTarget } from './firebase.js';
import { Doughnut } from 'react-chartjs-2';

let GoalDefaultMode = ({
    protein,
    fat,
    carbs,
    handleEditClick
}) => (
        <div className="goals-box white-text">
            <div className="goals-box-numbers">
                <div className="goalDiv">
                    <p>{protein}</p>
                    <p>{fat}</p>
                    <p>{carbs}</p>
                </div>

                <div className="labelDiv">
                    <p>Protein</p>
                    <p>Fat</p>
                    <p>Carbs</p>
                </div>
            </div>
            <Doughnut
                data={{
                    labels: ['Protein', 'Fat', 'Carbs'],
                    datasets: [
                        {
                            data: [protein, fat, carbs],
                            backgroundColor: ['DarkBlue', 'Blue', 'LightBlue']
                        }
                    ]
                }}
                options={{
                    legend: {
                        position: 'bottom'
                    }
                }}
                width={100}
                height={50} />
            <button className="btn" onClick={handleEditClick}>Edit</button>
        </div>
    );

let GoalEditMode = ({
    protein,
    fat,
    carbs,
    handleChange,
    handleSaveClick,
    cancel
}) => (
        <div className="white-text">
            <div className="goals-main-target">
                <div className="target-form">
                    <input type="text" name="protein" placeholder="Protein" onChange={handleChange} value={protein} />Protein
                    <input type="text" name="fat" placeholder="Fat" onChange={handleChange} value={fat} />Fat
                    <input type="text" name="carbs" placeholder="Carbs" onChange={handleChange} value={carbs} />Carbs<br />
                    <a className="btn" onClick={handleSaveClick}>Save</a>
                    <a className="btn" onClick={cancel}>Cancel</a>
                </div>
            </div>
        </div>
    );

class GoalBox extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            // protein: props.goals.protein,
            // fat: props.goals.fat,
            // carbs: props.goals.carbs,
            editing: false
        }
    }

    componentDidMount() {
        getTarget(this.setState.bind(this));
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    toggleEdit = () => {
        this.setState({
            editing: !this.state.editing
        });
    }

    saveEdit = (protein, fat, carbs) => {
        let newGoal = {
            protein: protein,
            fat: fat,
            carbs: carbs
        };

        const targetRef = firebase.database().ref(`days/day1/target`);
        targetRef.set(newGoal);
        this.setState({ newGoal });
        this.setState({ editing: false });
    }

    cancel = () => {
        this.setState({ editing: false });
    }

    render() {
        return (this.state.editing === false)
            ? (
                <GoalDefaultMode
                    protein={this.state.protein}
                    fat={this.state.fat}
                    carbs={this.state.carbs}
                    handleEditClick={() => this.toggleEdit()}
                />

            )
            : (
                <GoalEditMode
                    protein={this.state.protein}
                    fat={this.state.fat}
                    carbs={this.state.carbs}
                    handleChange={this.handleChange}
                    handleSaveClick={() => this.saveEdit(this.state.protein, this.state.fat, this.state.carbs)}
                    cancel={this.cancel}
                />
            );
    }
}

export default GoalBox;