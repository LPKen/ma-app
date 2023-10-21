return (
    <SafeAreaView style={{flex: 1,backgroundColor: '#12142A'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
            {content()}
        </ScrollView>
    </SafeAreaView>
)

const content = () => {
    if (loading) {
        return <ActivityIndicator style={{marginTop: 200}} color='#FFA927' size="large"/>
    } else {
        return (xyz)
    }
}

const [loading, setLoading] = useState(true);

//setLoading(true) in useEffect, useFocusEffect
//setLoading(false) nach Fetch



