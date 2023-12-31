import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
  StyleProp,
  ImageStyle,
  LogBox,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { postIconOutlined, searchIcon } from '../../svg/svg-xml-list';
import FloatingButton from '../../components/FloatingButton';
import useAuth from '../../hooks/useAuth';
import Explore from '../Explore';
import GlobalFeed from '../GlobalFeed';
import styles from './styles';
import CreatePostModal from '../../components/CreatePostModal';
import CustomTab from '../../components/CustomTab';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
LogBox.ignoreAllLogs(true);
export default function Home() {
  // const { t, i18n } = useTranslation();

  const { client } = useAuth();

  const [activeTab, setActiveTab] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onClickSearch = () => {
    navigation.navigate('CommunitySearch');
  };
  navigation.setOptions({
    // eslint-disable-next-line react/no-unstable-nested-components
    headerRight: () => (
      <TouchableOpacity onPress={onClickSearch} style={styles.btnWrap}>
        <SvgXml xml={searchIcon} width="25" height="25" />
      </TouchableOpacity>
    ),
    headerTitle: 'Community',
  });

  const openCreatePostModal = () => {
    setCreatePostModalVisible(true);
  };

  const closeCreatePostModal = () => {
    setCreatePostModalVisible(false);
    closeModal();
  };
  const openModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnimation]);

  const renderTabComponent = () => {
    let globalFeedStyle: StyleProp<ImageStyle> | StyleProp<ImageStyle>[] =
      styles.visible;
    styles.visible;
    let exploreStyle: StyleProp<ImageStyle> | StyleProp<ImageStyle>[] =
      styles.invisible;
    styles.visible;
    if (activeTab === 2) {
      globalFeedStyle = styles.invisible;
      exploreStyle = styles.visible;
    }
    return (
      <View>
        <View style={globalFeedStyle}>
          <GlobalFeed />
          <FloatingButton onPress={openModal} />
        </View>
        <View style={exploreStyle}>
          <Explore />
        </View>
      </View>
    );
  };
  const modalStyle = {
    transform: [
      {
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [600, 0], // Adjust this value to control the sliding distance
        }),
      },
    ],
  };
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  return (
    <View>
      {/* {renderTabView()} */}
      <CustomTab
        tabName={['Newsfeed', 'Explore']}
        onTabChange={handleTabChange}
      />
      {renderTabComponent()}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        <Pressable onPress={closeModal} style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, modalStyle]}>
            <TouchableOpacity
              onPress={openCreatePostModal}
              style={styles.modalRow}
            >
              <SvgXml xml={postIconOutlined} width="28" height="28" />
              <Text style={styles.postText}>Post</Text>
            </TouchableOpacity>
            <CreatePostModal
              visible={createPostModalVisible}
              onClose={closeCreatePostModal}
              userId={(client as Amity.Client).userId as string}
              onSelect={closeCreatePostModal}
            />
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}
