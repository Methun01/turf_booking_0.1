import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Details = ({ route }) => {
    const { image_title, time,game,date } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Details</Text>
            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Turf Place</Text>
                    <Text style={styles.detailValue}>{image_title}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailValue}>{time}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Game</Text>
                    <Text style={styles.detailValue}>{game}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <Text style={styles.detailValue}>800 + 30 (GST)</Text>
                    
                </View>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Total</Text>
                    <Text style={{fontWeight:'bold',fontSize:20}}>830</Text>
                </View>
                <View style={styles.detailItem}>
                    <TouchableOpacity style={{backgroundColor:'green',width:'100%',borderRadius:25,padding:12,elevation:24,shadowColor:'black',shadowOpacity:0.26}}><Text style={{fontWeight:'bold',textAlign:'center',color:'white',fontSize:18}}>Book Now</Text></TouchableOpacity>
                </View>
            </View>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    detailsContainer: {
        backgroundColor: 'white',
        padding: 20,
        elevation: 14,
        shadowOpacity: 0.26,
        shadowColor: 'black',
        borderRadius: 10,
        height:400,
        justifyContent: 'flex-start',
        marginHorizontal: 10,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    detailLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left',
    },
    detailValue: {
        fontSize: 18,
        flex: 1,
        textAlign: 'right',
    },
});

export default Details;
