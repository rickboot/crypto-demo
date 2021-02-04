
function Table({ columns, data, onFilterChange, viewParams }) {
  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      manualFilters: true,

      initialState: viewParams,
      useControlledState: state => {
        const vp = viewParams;
        return React.useMemo(
          () => ({
            ...state,
            ...vp
          }),
          [state, vp]
        );
      }

    },
    useFilters // useFilters!
  );


  const { sortBy, filter } = state;


  useEffect(() => {
    onFilterChange({ sortBy, filter });
  }, [onFilterChange, sortBy, filter]);




function App() {
  
  const [filter, setFilter] = useState({
    sortBy: [{ id: "name", desc: false }],
    filters: []
  });

  return (
    <Styles>
      <Table
        columns={columns}
        data={data}
        onFilterChange={setFilter}
        viewParams={filter}
      />
    </Styles>
  );
}