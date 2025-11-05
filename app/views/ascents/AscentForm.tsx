import React, {useState} from 'react'
import {FieldBase, Form, SubmitButton} from "@javascript/components";
import {Form, TextField, FieldBase, Select, SubmitButton} from '@javascript/components'
import {Box, Button, createTheme, IconButton, ThemeProvider, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {ascentTheme} from "@javascript/components/ascentColors";
import { Check } from '@mui/icons-material';

type ColorPickerProps = {
    colors: string[]
    color: string
    onChange: (value: string) => undefined
}

const ColorPicker = ({colors, color, onChange}: ColorPickerProps) => {
    return (
        <ThemeProvider theme={ascentTheme}>
            <ul style={{listStyle: 'none'}}>
                {colors.map(({label, value}) => (
                    <li
                        key={label}
                        style={{marginBottom: '1rem'}}
                    >
                        <Button
                            type='button'
                            variant='contained'
                            color={label}
                            style={{
                                width: '20rem',
                            }}
                            onClick={() => onChange(value)}
                            endIcon={label === color ? <Check /> : null}
                        >
                            {label}
                        </Button>
                    </li>
                ))}
            </ul>
        </ThemeProvider>
    )
}

export default function AscentForm({ascentForm, validationErrors}) {
    const {form, extras, inputs} = ascentForm
    const [tries, setTries] = useState(Number(inputs.tries.defaultValue) || 0);
    const [color, setColor] = useState(inputs.color.defaultValue);

    return (
        <>
            {/*<pre>{JSON.stringify(ascentForm, null, 4)}</pre>*/}
            {/*<pre>{JSON.stringify(validationErrors, null, 4)}</pre>*/}

            <Form {...form} extras={extras} validationErrors={validationErrors}>

                <div>
                    <input type='hidden' id={inputs.color.id} name={inputs.color.name} value={color}/>
                    <FieldBase {...inputs.color} label='Color' errorKey='color'>
                        <ColorPicker
                            color={color}
                            colors={inputs.color.options}
                            onChange={(color) => setColor(color)}
                        />
                    </FieldBase>
                </div>

                <div>
                    <input type='hidden' id={inputs.tries.id} name={inputs.tries.name} value={tries}/>
                    <FieldBase {...inputs.tries} label='Tries' errorKey='tries'>
                        <Box display="flex" alignItems="center" gap={1}>
                            <IconButton
                                onClick={() => setTries(Math.max(tries - 1, 0))}
                                color="primary"
                                aria-label="Decrease"
                                disabled={tries <= 0}
                            >
                                <RemoveIcon/>
                            </IconButton>

                            <Box width={32} textAlign="center">
                                <Typography variant="body1">{tries === 0 ? 'flash' : tries.toString()}</Typography>
                            </Box>

                            <IconButton
                                onClick={() => setTries(tries + 1)}
                                color="primary"
                                aria-label="Increase"
                            >
                                <AddIcon/>
                            </IconButton>
                        </Box>
                    </FieldBase>
                </div>

                <div>
                    <SubmitButton variant='contained' {...inputs.submit} />
                    {/*<Button variant='outlined' color='secondary'>Cancel</Button>*/}
                </div>
            </Form>
        </>
    )
}
