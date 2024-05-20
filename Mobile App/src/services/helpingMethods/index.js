import {UIManager, LayoutAnimation, Platform} from 'react-native'

export const handleAnimation = () => {
    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
}
export const checkExpiry = () => {
    var d1 = Date.parse('2012-11-01')
    var d2 = Date.parse('2012-11-04')
    var expiryDate = Date.parse('2020-12-18')
    var currentDate = Date.now()
    console.log(expiryDate > currentDate)
    if (expiryDate < currentDate) {
        return true
    } else {
        return false
    }
}
export const compareDate = () => {
    var date1 = new Date('December 25, 2017 01:30:00')
    var date2 = new Date('June 18, 2016 02:30:00')
    console.log(date1.getTime() > date2.getTime())
    //best to use .getTime() to compare dates
    //if (date1.getTime() === date2.getTime()) {
    //same date
    //}

    if (date1.getTime() > date2.getTime()) {
        return true
    } else {
        return false
    }
}

export const letterColors = {
    a: '#ed4013',
    b: '#4db839',
    c: '#b3c388',
    d: '#ff6e5a',
    e: '#38b6ff',
    f: '#cb6ce6',
    g: '#a6a6a6',
    h: '#ff66c4',
    i: '#acd798',
    j: '#7f8a86',
    k: '#5271ff',
    l: '#eb8b24',
    m: '#c1c3be',
    n: '#f1697a',
    o: '#f4c01e',
    p: '#67829d',
    q: '#d096e1',
    r: '#e4b86e',
    s: '#f1658f',
    t: '#688165',
    u: '#9ea521',
    v: '#d8ad6f',
    w: '#b29eb6',
    x: '#BDB76B',
    y: '#eb7474',
    z: '#49cea7'
}
