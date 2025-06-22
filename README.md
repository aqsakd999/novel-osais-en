# React TypeScript Codebase

## Installation & Run

### Setup

- `yarn install`
- `cp .env.sample .env`

Update `.env` with development/test environment variables

### Compiles and hot-reloads for development

`yarn start`

### Compiles and minifies for production

`yarn build`

### Lints and fixes files

`yarn lint --fix`

### Format code

`yarn format`

### Test

`yarn test`

### Test coverage

`yarn test:coverage`

## Run with Docker

### Docker Setup

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) on Developer's machine

### Docker start and run

`docker-compose up`

### Docker build

`docker-compose build`

### Docker start

`docker-compose start`

### Docker stop

`docker-compose stop`

## CI/CD

### GitLab CI

Please check `.gitlab-ci.yml` sample

### Jenkins CI

Please check `Jenkinsfile` sample

## Folder Structure

<table>
<thead>
<tr>
<th>Folder</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>public</td>
<td>Public resources like favicon, logo, manifest, robots.txt </td>
</tr>
<tr>
<td>src</td>
<td>Location for all source files</td>
</tr>
<tr>
<td>src/actions</td>
<td>Location for Redux actions</td>
</tr>
<tr>
<td>src/api</td>
<td>API requests using Axios</td>
</tr>
<tr>
<td>src/assets</td>
<td>Assets like CSS, SCSS, styles, images, etc.</td>
</tr>
<tr>
<td>src/components</td>
<td>Shared components</td>
</tr>
<tr>
<td>src/config</td>
<td>Location for application routes, constants, context, provider</td>
</tr>
<tr>
<td>src/helpers</td>
<td>Helper functions</td>
</tr>
<tr>
<td>src/layout</td>
<td>Location for layout components</td>
</tr>
<tr>
<td>src/locales</td>
<td>Location for localized text files as JSON format</td>
</tr>
<tr>
<td>src/pages</td>
<td>Location for page components</td>
</tr>
<tr>
<td>src/store</td>
<td>Location for Redux store</td>
</tr>
</tbody>
</table>
