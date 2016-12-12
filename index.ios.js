
import React, { Component } from 'react';
import { ScrollView, Alert, StyleSheet, AppRegistry,Text, TextInput, ListView, View, Image } from 'react-native';
import axios from 'axios';
import styles from './styles';
import api from './api';

export default class ReactNativeApp1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      text: '',
    }
  }

  componentDidMount() {
    this.getStores()
  }

  getStores() {
    axios.get(api() + '/stores')
      .then((response) => {
        let stores = response.data.data.slice(0);
        this.setState({
          stores: stores,
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onNewStoreSearch(text){
    this.setState({
      newItemValue: text
    })
  }

  onSearchSubmit(e) {
    e.preventDefault();
    axios.get(api() + '/stores?name[$like]=*' + this.state.newItemValue + '*&$sort[name]=-1&$limit=12')
      .then((response) => {
        var newStores = response.data.data.slice(0);
        this.setState({
          stores: newStores,
          newItemValue: ''
        })
      }).catch(function (error) {
        console.log(error);
      });
  }

  getStoresRows() {
    var ds = this.getStoresDataSource();
    return ds.cloneWithRows(this.state.stores);
  }

  // Create a ListView with some behavior that determines
  // when a given row should re-render
  getStoresDataSource() {
    return new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }

  render() {
    return (

      <View style={styles.container}>
        <View
          style={{
            marginTop:35,
            alignItems:'center'
          }}>
            <Text style={styles.titleName}>Store Locator</Text>
        </View>
        <View onSubmit={this.onSearchSubmit.bind(this)} >
          <TextInput onChangeText={this.onNewStoreSearch.bind(this)} value={this.state.newItemValue} placeholder="Search store..."
            style={styles.inputSearch}
            onSubmitEditing={this.onSearchSubmit.bind(this)} />
        </View>
        <ListView
            style={{margin:20}}
            enableEmptySections={true}
            dataSource={this.getStoresRows()}
            renderRow={(rowData)=>
                <View
                  style={styles.stores}>
                  <Text style={styles.storeName}>{rowData.name}</Text>
                  <Text style={styles.storeAddress}>{rowData.address}</Text>
                  <Text style={styles.storeAddress}>{rowData.city}, {rowData.state}</Text>
                  <Text style={styles.storeHours}>{rowData.hours}</Text>
                </View>
            }/>
        </View>
    );
  }
}










//
//
//
//       <ScrollView>
//         <View style={styles.container}>
//           {this.state.stores.map((store) => {
//             return (
//               <View key={store.id}>
//                 <Text style={styles.store}>{store.name}</Text>
//                 <Text style={styles.stores}>{store.address}</Text>
//                 <Text style={styles.stores}>{store.city}, {store.state}</Text>
//               </View>
//             )
//           })}
//         </View>
//       </ScrollView>
//     );
//   }
// }



AppRegistry.registerComponent('ReactNativeApp1', () => ReactNativeApp1);
