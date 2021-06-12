import {GET_AUTHOR_BY_PK, GET_AUTHORS, INSERT_AUTHOR} from '../lib/graphql/authors'
import {client} from '../lib/graphql/client'
import { useMutation, useQuery } from '@apollo/client';


import {useCallback, useEffect, useState} from 'react'
import debounce from "lodash.debounce";

import CreatableSelect from 'react-select/creatable';
import { message } from 'antd';


export default function Select({onSelect, value}) {

    const [isLoading, setIsLoading] = useState(false)
    const [options, setOptions] = useState([])

    const [selectedOption, setSelectedOption] = useState(null)

    const [inputValue, setInputValue] = useState('')

    // const { loading, error, data, refetch } = useQuery(GET_AUTHORS, {variables: { name: `%${inputValue}%` } });
    // console.log(error, data, loading)


    const [insertNewAuthor] = useMutation(INSERT_AUTHOR);


    // const check = useCallback(
    // debounce(async () => {
    //   console.log('go for data', inputValue);

        

    // }, 100),
    // [inputValue]
    // );

    // useEffect(() => {
    //     console.log("checkkk")
    //     check()
    // }, [])


    useEffect(async () => {
        let newOptions = []
        if (inputValue) {
            const {data: {Authors: authorsData} } = await client.query({query: GET_AUTHORS, variables: {name: `%${inputValue}%`}, fetchPolicy: 'network-only' })
            newOptions = authorsData.map(d => ({value: d.id, label: d.name}))
        }

        if (value && value.length) {
            const selectedOptionMaps = []
            for(let i = 0; i < value.length; i++) {
                const authorID = value[i]
                const {data: {Authors_by_pk: datum} } = await client.query({query: GET_AUTHOR_BY_PK, variables: {id: authorID}, fetchPolicy: 'network-only' })
                newOptions.push({value: datum.id, label: datum.name})
                selectedOptionMaps.push({value: datum.id, label: datum.name})
            }
            setSelectedOption(selectedOptionMaps)
        } else {
            setSelectedOption(null)
        }

        // console.log(...newOptions)
        setOptions(newOptions)

    }, [inputValue, value])



    const handleInputChange = (inputVal, meta) => {
        // console.log('SET INPUT VALUE',inputVal, meta)
        setInputValue(inputVal)
    }

    const handleChange = (newValue, actionMeta) => {
        // console.group('Value Changed');
        // console.log(newValue);
        // console.log(`action: ${actionMeta.action}`);
        // console.groupEnd();
        onSelect(newValue.map(v => v.value))
        // this.setState({ value: newValue });
      };


    const handleCreate = async (inputValue) => {
        setIsLoading(true)

        // console.group('Option created');
        // console.log('Wait a moment...');

        try {
        const {data: {insert_Authors_one: newData}} = await insertNewAuthor({variables: {name: inputValue}})
        
        //client.mutate({mutation: INSERT_AUTHOR, variables: {name: inputValue} })

        // console.log(newData)
        // console.log(inputValue);
        // console.groupEnd();

        
        // await refetch()
        setIsLoading(false)
        setOptions([...options, {value: newData.id, label: newData.name}])
    
        onSelect([...value, newData.id])

        // const { options } = this.state;

        
        } catch (e) {
            message.error(e.message)
            setIsLoading(false)
        }

        // const newOption = createOption(inputValue);
        

        //   this.setState({
        //     isLoading: false,
        //     options: [...options, newOption],
        //     value: newOption,
        //   });

        
      };


    console.log("SELECTED VALUE", value)

    return <CreatableSelect
    isMulti
    noOptionsMessage={() => "Search to Create or select an Author"}
    placeholder="Select or Create Book's Authors"
    isClearable
    inputValue={inputValue}
    isDisabled={isLoading}
    isLoading={isLoading}
    onInputChange={handleInputChange}
    onChange={handleChange}
    onCreateOption={handleCreate}
    // options={data ? data.Authors.map(d => ({value: d.id, label: d.name})) : [] }
    options={options}
    value={selectedOption}
  />
}