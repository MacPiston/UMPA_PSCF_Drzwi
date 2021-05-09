/* eslint-disable import/prefer-default-export */
import { StyleSheet } from 'react-native';
import { Colors } from '../../AppGlobalStyles/GlobalStylesheets';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 0,
    backgroundColor: Colors.LightBackground,
  },
  item: {
    backgroundColor: Colors.TileBackgroud,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 24,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: Colors.LightBackground,
  },
  header: {
    flexGrow: 1,
    fontSize: 38,
    backgroundColor: Colors.BlueAccent,
    marginBottom: 0,
    marginVertical: 0,
    textAlign: 'center',
  },
  tileText: {
    fontSize: 20,
  },
  openButton: {
    borderRadius: 8,
    backgroundColor: '#44c282',
    padding: 10,
    textAlign: 'center',
  },
  points: {
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
});
