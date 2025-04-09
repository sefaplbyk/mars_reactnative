import { Button, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { updateUserProfile } from '../../services/userService'

const EditProfileModal = ({ modalVisible, setModalVisible, userData, setUserData }) => {

    const [modalTempData, setModalTempData] = useState({
        tempName: userData.fullname,
        tempBio: userData.bio
    })

    const updateProfile = async () => {
        const result = await updateUserProfile(
            userData._id,
            modalTempData.tempName,
            modalTempData.tempBio
        );

        if (result.success) {
            setUserData({
                ...userData,
                fullname: modalTempData.tempName,
                bio: modalTempData.tempBio
            });
            console.log("Profil başarıyla güncellendi:", result.data);
            setModalVisible(false);
        } else {
            console.error("Güncelleme başarısız:", result.error);
        }
    };


    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>

                <View style={styles.modalContent}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>{
                        userData.fullname
                    }</Text>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>Profili Düzenle</Text>

                    <TextInput
                        value={modalTempData.tempName}
                        onChangeText={text => setModalTempData({ ...modalTempData, tempName: text })}
                        style={styles.input}
                        placeholder="İsim"
                    />
                    <TextInput
                        value={modalTempData.tempBio}
                        onChangeText={text => setModalTempData({ ...modalTempData, tempBio: text })}
                        style={[styles.input, { height: 60 }]}
                        placeholder="Bio"
                        multiline
                    />
                    <View style={{ marginTop: 10 }} />
                    <Button title="Kaydet" onPress={updateProfile} />
                    <View style={{ marginTop: 10 }} />
                    <Button title="İptal" color="gray" onPress={() => setModalVisible(false)} />
                </View>
            </View>
        </Modal>
    )
}

export default EditProfileModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        width: "80%",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginTop: 10,
        borderRadius: 5,
    },
})