import React from 'react';
import { Text, Button, View, ScrollView, TouchableOpacity } from 'react-native';
import styles from './styles';
import TagSelector from 'react-native-tag-selector';

import firebase from 'firebase';
import { app, db } from '../config/firebase';

class NewItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFridge: [],
      selections: [],
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    var user = firebase.auth().currentUser;
    let userFridge = [];
    if (user) {
      await db
        .collection('users')
        .doc(user.email)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            console.log('document data obtained');
            userFridge = doc.data().fridge;
          } else {
            console.log('document does not exist');
          }
        });
    }
    this.setState({ currentFridge: userFridge });
  }

  clickHandler(selection) {
    this.setState({
      selections: selection,
    });
  }

  async handleSubmit() {
    let newFridge = [...this.state.currentFridge, ...this.state.selections];
    var user = firebase.auth().currentUser;
    console.log('user', user);
    if (user) {
      await db
        .collection('users')
        .doc(user.email)
        .set(
          {
            fridge: newFridge,
          },
          { merge: true }
        );
    }
    this.props.navigation.navigate('Fridge');
  }

  render() {
    let answers = this.props.navigation.getParam('answers');
    if (!answers) {
      answers = [];
    }
    const data = answers.map(answer => {
      return { id: answer, name: answer };
    });
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.loginContainer}>
            <Text>Here's what we got from that image: </Text>
            <View style={styles.possibilitiesContainer}>
              <TagSelector
                tags={data}
                onChange={selected => this.clickHandler(selected)}
              />
            </View>
            <TouchableOpacity
              title="Back to Fridge"
              onPress={() => this.props.navigation.navigate('Fridge')}
              style={styles.defaultBtn}
            >
              <Text style={styles.defaultBtnText}>Back to Fridge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleSubmit}
              style={styles.defaultBtn}
            >
              <Text style={styles.defaultBtnText}>Add New Items</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default NewItems;