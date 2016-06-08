## HOWTO:

* Create or edit the config.js file in the root folder (see README for details on this).
* Add one of the following sections as the 'owAuth' property

### SAML based authentication.

For OWEX, you'll need to setup an ADFS trust, see: https://wiki.owex.oliverwyman.com/wiki/ADFS#.28Manual.29_Configuration_of_a_SAML_Assertion_Consumer_Endpoint_type
```

```

### Hardcoded authentication

DO NOT USE THIS FOR PRODUCTION SITES - Only really useful for testing.

```

```

### No authentication

DO NOT USE THIS FOR PRODUCTION SITES - Only really useful for testing.

```
{
  authMethod: 'none'
}
```
