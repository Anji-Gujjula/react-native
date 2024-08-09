import React, { useState } from 'react';
import { View, Button, Text, TextInput, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

const App = () => {
  const [fileName, setFileName] = useState('');

  const uploadFile = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });

      const response = await axios.post('http://localhost:8080/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', response.data);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'File selection was cancelled');
      } else {
        Alert.alert('Error', err.message);
      }
    }
  };

  const downloadFile = async () => {
    try {
      const response = await axios({
        url: `http://localhost:8080/files/download/${fileName}`,
        method: 'GET',
        responseType: 'blob',
      });

      const fileURL = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Upload File" onPress={uploadFile} />
      <TextInput
        style={{ marginVertical: 20, borderBottomWidth: 1, padding: 10 }}
        placeholder="Enter file name to download"
        value={fileName}
        onChangeText={setFileName}
      />
      <Button title="Download File" onPress={downloadFile} />
    </View>
  );
};

export default App;
