/* eslint-disable import/prefer-default-export */
import { StyleSheet } from 'react-native';
import { Colors } from '../../AppGlobalStyles/GlobalStylesheets';

export const Styles = StyleSheet.create({
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexGrow: 1,
    fontSize: 38,
    backgroundColor: Colors.BlueAccent,
    marginBottom: 10,
    marginVertical: 0,
    textAlign: 'center',
  },
  tile: {
    fontSize: 24,
  },
});
