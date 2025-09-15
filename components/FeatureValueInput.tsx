import React, {useEffect, useState} from 'react'
import {ObjectInputProps, PatchEvent, set, unset, FormField} from 'sanity'
import {useClient} from 'sanity'

const inputSelectStyles = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '1rem',
  lineHeight: '1.5',
  borderRadius: '4px',
  border: '1px solid var(--card-border-color)',
  backgroundColor: 'var(--card-bg-color)',
  color: 'var(--card-fg-color)',
  boxSizing: 'border-box' as const,
  outline: 'none',
  transition: 'border-color 0.2s ease',
}

const inputSelectFocusStyles = {
  borderColor: 'var(--card-focus-ring-color)',
  boxShadow: '0 0 0 3px var(--card-focus-ring-shadow)',
}

export default function FeatureWithValueInput(props: ObjectInputProps) {
  const {value = {}, onChange} = props
  const client = useClient({apiVersion: '2025-08-04'})

  const [featureData, setFeatureData] = useState<{
    inputType?: string
    options?: string[]
    referenceType?: string
  } | null>(null)

  const [featuresList, setFeaturesList] = useState<{_id: string; name: string}[]>([])
  const [referenceOptions, setReferenceOptions] = useState<{_id: string; name: string}[]>([])

  // ✅ Завантажуємо список характеристик тільки з Sanity
  useEffect(() => {
    client
      .fetch(`*[_type == "feature"]{_id, name}`)
      .then((data) => setFeaturesList(data))
      .catch(() => setFeaturesList([]))
  }, [client])

  // ✅ Завантажуємо дані для поточної характеристики
  useEffect(() => {
    if (!value.feature?._ref) {
      setFeatureData(null)
      setReferenceOptions([])
      return
    }

    client
      .fetch(`*[_type == "feature" && _id == $id][0]{inputType, options, referenceType}`, {
        id: value.feature._ref,
      })
      .then((data) => {
        setFeatureData(data)

        // Якщо характеристика має referenceType → тягнемо список з Sanity
        if (data?.inputType === 'reference' && data?.referenceType) {
          client
            .fetch(`*[_type == $refType] | order(name asc){_id, name}`, {
              refType: data.referenceType,
            })
            .then((items) => setReferenceOptions(items))
            .catch(() => setReferenceOptions([]))
        } else {
          setReferenceOptions([])
        }
      })
      .catch(() => setFeatureData(null))
  }, [value.feature?._ref, client])

  const [featureSelectFocused, setFeatureSelectFocused] = useState(false)
  const [valueInputFocused, setValueInputFocused] = useState(false)

  const onFeatureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    if (!selectedId) {
      onChange(PatchEvent.from(set({...value, feature: undefined, value: ''})))
    } else {
      onChange(
        PatchEvent.from(
          set({...value, feature: {_type: 'reference', _ref: selectedId}, value: ''}),
        ),
      )
    }
  }

  const onValueChange = (val: string) => {
    if (val === '') {
      onChange(PatchEvent.from(unset(['value'])))
    } else {
      onChange(PatchEvent.from(set(val, ['value'])))
    }
  }

  return (
    <div>
      {/* Вибір характеристики */}
      <FormField label="Характеристика" style={{marginBottom: 16}}>
        <select
          value={value.feature?._ref || ''}
          onChange={onFeatureChange}
          onFocus={() => setFeatureSelectFocused(true)}
          onBlur={() => setFeatureSelectFocused(false)}
          style={{
            ...inputSelectStyles,
            ...(featureSelectFocused ? inputSelectFocusStyles : {}),
          }}
        >
          <option value="">Оберіть характеристику</option>
          {featuresList.map((feature) => (
            <option key={feature._id} value={feature._id}>
              {feature.name}
            </option>
          ))}
        </select>
      </FormField>

      {/* Вибір значення */}
      <FormField label="Значення">
        {featureData?.inputType === 'reference' ? (
          <select
            value={typeof value.value === 'string' ? value.value : ''}
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={() => setValueInputFocused(true)}
            onBlur={() => setValueInputFocused(false)}
            style={{
              ...inputSelectStyles,
              ...(valueInputFocused ? inputSelectFocusStyles : {}),
            }}
          >
            <option value="">Оберіть значення</option>
            {referenceOptions.map((opt) => (
              <option key={opt._id} value={opt.name}>
                {opt.name}
              </option>
            ))}
          </select>
        ) : featureData?.inputType === 'select' ? (
          <select
            value={typeof value.value === 'string' ? value.value : ''}
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={() => setValueInputFocused(true)}
            onBlur={() => setValueInputFocused(false)}
            style={{
              ...inputSelectStyles,
              ...(valueInputFocused ? inputSelectFocusStyles : {}),
            }}
          >
            <option value="">Оберіть значення</option>
            {featureData.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={typeof value.value === 'string' ? value.value : ''}
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={() => setValueInputFocused(true)}
            onBlur={() => setValueInputFocused(false)}
            style={{
              ...inputSelectStyles,
              ...(valueInputFocused ? inputSelectFocusStyles : {}),
            }}
          />
        )}
      </FormField>
    </div>
  )
}
