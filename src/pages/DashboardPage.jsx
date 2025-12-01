const { location, timePeriod, shift } = useGlobalFilter();

useEffect(() => {
    load({
        location,
        timePeriod,
        shift
    });
}, [location, timePeriod, shift]);
