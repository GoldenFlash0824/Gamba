import React, {useState, useEffect} from 'react'
import {StyleSheet, View, FlatList, Platform, Text} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import axios from 'axios'
import {useSelector} from 'react-redux'
import {useIsFocused} from '@react-navigation/native'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import {getHeaders} from '../../../utils/helpers'
import SoldProductsCard from '../../../components/components/common/SoldProductsCard'
import ShowAlert from '../../../components/components/common/ShowAlert'
import Loader from '../../../components/components/common/Spinner'
import ActiveButton from '../../../components/components/common/ActiveButton'

const ProductPurchasedScreen = ({navigation}) => {
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [productsData, setProductsData] = useState([])
    const [showLoadMore, setShowLoadMore] = useState(false)
    const [nextPageToken, setNextPageToken] = useState(1)
    const isFocused = useIsFocused()

    useEffect(() => {
        const func = async () => {
            await doGetPurchsedProduct()
        }
        isFocused ? func() : (setNextPageToken(1), setShowLoadMore(false))
    }, [isFocused])

    const doGetPurchsedProduct = async (page = 1) => {
        const headers = getHeaders(userData.auth_token)

        try {
            setLoading(true)
            await axios
                .get(`user/checkout/orders?page=${page}`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        setShowLoadMore(response.data.data.length >= 15)
                        if (page > 1) {
                            setProductsData(productsData.concat(response.data.data))
                            setLoading(false)
                        } else {
                            setProductsData(response.data.data)
                            setLoading(false)
                        }
                    } else {
                        setLoading(false)
                        ShowAlert({type: 'error', description: response.data.message})
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    ShowAlert({type: 'error', description: error.message})
                })
        } catch (e) {
            setLoading(false)
            ShowAlert({type: 'error', description: e.message})
        }
    }

    const renderItem = ({item}) => {
        return <SoldProductsCard item={item} purchased={true} soldP={true} />
    }
    const doFetchMoreOrderHistory = async () => {
        setNextPageToken(nextPageToken + 1)
        await doGetPurchsedProduct(nextPageToken + 1)
    }
    const renderFooter = () => {
        return showLoadMore && <ActiveButton style={styles.moreButton} title="Load More" onPress={() => doFetchMoreOrderHistory()} />
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title={'Orders'} />
            {productsData.length > 0 ? (
                <View style={styles.dataListCard}>
                    <FlatList data={productsData} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.flatListCon} showsVerticalScrollIndicator={false} ListFooterComponent={renderFooter} />
                </View>
            ) : (
                <View style={styles.noDataWraper}>
                    <Text style={styles.noDataText}>{!loading && 'No data found'}</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        flex: 1,
        backgroundColor: Colors.White
    },
    dataListCard: {
        alignItems: 'center',
        width: wp('100%'),
        flex: 1
    },
    flatListCon: {
        paddingBottom: hp('15'),
        width: wp('100%')
    },
    noDataWraper: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('70%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    moreButton: {
        alignSelf: 'center',
        marginTop: hp('1%')
    }
})

export default ProductPurchasedScreen
