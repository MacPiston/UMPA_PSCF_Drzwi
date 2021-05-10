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
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 24,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  inRangeColor: {
    backgroundColor: Colors.GreenAccent,
  },
  outOfRangeColor: {
    backgroundColor: Colors.TileBackgroud,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  headerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    textAlign: 'center',
  },
  header: {
    flexGrow: 1,
    fontSize: 38,
    backgroundColor: Colors.GrayAccent,
    marginVertical: 0,
    paddingTop: 8,
    paddingBottom: 10,
    textAlign: 'center',
    color: Colors.Font,
  },
  headerButton: {
    flexGrow: 1,
    fontSize: 38,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: Colors.GrayAccent,
    color: Colors.TileBackgroud,
    paddingTop: 14,
    paddingLeft: 14,
    paddingRight: 14,
  },
  tileText: {
    fontSize: 20,
  },
  openButton: {
    borderRadius: 8,
    backgroundColor: Colors.GrayAccent,
    padding: 20,
    textAlign: 'center',
    color: Colors.Font,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
});
