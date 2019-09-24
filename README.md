# Auth API
[![Build Status](https://travis-ci.org/markwylde/sso-auth-api.svg?branch=master)](https://travis-ci.org/markwylde/sso-auth-api)
[![David DM](https://david-dm.org/markwylde/sso-auth-api.svg)](https://david-dm.org/markwylde/sso-auth-api)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/sso-auth-api)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/sso-auth-api)](https://github.com/markwylde/sso-auth-api/blob/master/package.json)
[![GitHub](https://img.shields.io/github/license/markwylde/sso-auth-api)](https://github.com/markwylde/sso-auth-api/blob/master/LICENSE)

This service provides an authentication api for user management.

## Responsibilities
- Validate a users credentials via username and password
- CRUD users
- CRUD sessions
- CRUD apps
- CRUD app sessions

## Endpoints

<table>
  <tr>
    <th></th>
    <th>Method</th>
    <th>Path</th>
    <th>Description</th>
  </tr>
  <tr>
    <td colspan=4>
      <strong>Apps</strong></br>
      To authenticate and act on behave of a user, you do so using an "app".
    </td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">1.1</a></td>
    <td>GET</td>
    <td>/v1/apps</td>
    <td>List all apps you can manage</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">1.2</a></td>
    <td>GET</td>
    <td>/v1/apps/:id</td>
    <td>Get information about an app you can manage</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">1.3</a></td>
    <td>POST</td>
    <td>/v1/apps </td>
    <td>Create a new app</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">1.4</a></td>
    <td>DELETE</td>
    <td>/v1/apps/:id</td>
    <td>Delete an app you can manage</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">1.5</a></td>
    <td>POST</td>
    <td>/v1/apps/:id/activate</td>
    <td>Claim ownership over a newly created app</td>
  </tr>
  <tr>
    <td colspan=4>
      <strong>Permissions</strong></br>
      The access that different users have in an app is controlled by "permissions".
    </td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">2.1</a></td>
    <td>GET</td>
    <td>/v1/apps/:appId/permissions</td>
    <td>List all permissions an app has available</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">2.2</a></td>
    <td>POST</td>
    <td>/v1/apps/:appId/permissions</td>
    <td>Create a new permission for an app you manage</td>
  </tr>
  <tr>
    <td colspan=4>
      <strong>App Sessions</strong></br>
      An app creates a "session" which is then passed to a user to authenticate.
    </td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">3.1</a></td>
    <td>GET</td>
    <td>/v1/apps/:appId/sessions</td>
    <td>List all sessions for an app you can manage</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">3.2</a></td>
    <td>GET</td>
    <td>/v1/apps/:appId/sessions/current</td>
    <td>Get information about the current app session</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">3.3</a></td>
    <td>POST</td>
    <td>/v1/apps/:appId/sessions</td>
    <td>Create a new app session for an app you can manage</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">4.2</a></td>
    <td>POST</td>
    <td>/v1/apps/:appId/sessions/:sessionId/activate</td>
    <td>Activate an app session</td>
  </tr>

  <tr>
    <td colspan=4>
      <strong>User Sessions</strong></br>
      A user session is stored on the sso provider and can authorise app sessions to act on their behalf.
    </td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">4.1</a></td>
    <td>GET</td>
    <td>/v1/sessions/current</td>
    <td>Get information about your user session</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">4.3</a></td>
    <td>POST</td>
    <td>/v1/sessions</td>
    <td>Create a new user session</td>
  </tr>

  <tr>
    <td colspan=4>
      <strong>Users</strong></br>
      Users are entities that can login to an app via the sso portal.
    </td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">5.1</a></td>
    <td>GET</td>
    <td>/v1/users</td>
    <td>List all users who have interacted with an app your manage</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">5.2</a></td>
    <td>GET</td>
    <td>/v1/users/:id</td>
    <td>Get information about a user</td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">5.3</a></td>
    <td>POST</td>
    <td>/v1/users</td>
    <td>Create a new user</td>
  </tr>

  <tr>
    <td colspan=4>
      <strong>Other endpoints</strong></br>
      These endpoints are provided for convenience.
    </td>
  </tr>
  <tr>
    <td><a href="https://www.github.com/markwylde/sso-auth-api">6.1</a></td>
    <td>GET</td>
    <td>/v1/permissions</td>
    <td>List all permissions across all apps</td>
  </tr>
</table>


# License
This project is licensed under the terms of the GPLv3 license.

