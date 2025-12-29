import {FieldBase, Form, SubmitButton, Checkbox} from '@javascript/components/Inputs';
import {ascentTheme} from '@javascript/components/ascentColors';
import useVisitFormSubmit from '@javascript/components/UseVisitFormSubmit';
import {Check} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  IconButton,
  ThemeProvider,
  Typography,
  Stack
} from '@mui/material';
import React, {useState} from 'react';

interface ColorPickerProps {
  colors: string[];
  color: string;
  onChange: (value: string) => undefined;
}

function ColorPicker({colors, color, onChange}: ColorPickerProps) {
  return (
    <ThemeProvider theme={ascentTheme}>
      <ul style={{paddingLeft: '9px',listStyle: 'none'}}>
        {colors.map(({label, value}) => (
          <li key={label} style={{marginBottom: '1rem'}}>
            <Button
              type="button"
              variant="contained"
              color={label}
              style={{
                width: '100%',
              }}
              onClick={() => onChange(value)}
              endIcon={label === color ? <Check/> : null}
              data-testid={label === color ? 'selected-color' : null}
            >
              {label}
            </Button>
          </li>
        ))}
      </ul>
    </ThemeProvider>
  );
}

export default function AscentForm({ascentForm, validationErrors, onCancel}) {
  const {form, extras, inputs} = ascentForm;
  const [isLoading, handleSubmit] = useVisitFormSubmit();
  const [tries, setTries] = useState(Number(inputs.tries.defaultValue) || 0);
  const [color, setColor] = useState(inputs.color.defaultValue);

  const handleTriesDecrement = () => setTries(Math.max(tries - 1, 0));
  const handleTriesIncrement = () => setTries(tries + 1);

  return (
    <>
      <Form {...form} extras={extras} validationErrors={validationErrors} {...handleSubmit}>
        {/* Color picker */}
        <div>
          <input
            type="hidden"
            id={inputs.color.id}
            name={inputs.color.name}
            value={color}
          />
          <FieldBase fullWidth {...inputs.color} label="Color" errorKey="color">
            <ColorPicker
              color={color}
              colors={inputs.color.options}
              onChange={color => setColor(color)}
            />
          </FieldBase>
        </div>

        {/* Tries picker */}
        <div>
          <input
            type="hidden"
            id={inputs.tries.id}
            name={inputs.tries.name}
            value={tries}
          />
          <FieldBase fullWidth {...inputs.tries} label="Tries" errorKey="tries">
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={handleTriesDecrement}
                color="primary"
                aria-label="Decrease"
                disabled={tries <= 0}
              >
                <RemoveIcon/>
              </IconButton>

              <Box textAlign="center">
                <Typography variant="body1" minWidth='5rem'>
                  {tries === 0 ? 'flash' : tries.toString()}
                </Typography>
              </Box>

              <IconButton
                onClick={handleTriesIncrement}
                color="primary"
                aria-label="Increase"
              >
                <AddIcon/>
              </IconButton>
            </Box>
          </FieldBase>
        </div>

        {/* Completed? */}
        <FieldBase {...inputs.completed} label="Topped?" errorKey="completed">
          <Box>
            <Checkbox {...inputs.completed} />
          </Box>
        </FieldBase>

        <Stack direction="column" spacing={1} p={2}>
          <SubmitButton fullWidth variant="contained" {...inputs.submit} loading={isLoading}/>
          {onCancel && <Button fullWidth variant="outlined" onClick={onCancel}>
            Cancel
          </Button>}
        </Stack>
      </Form>
    </>
  );
}
