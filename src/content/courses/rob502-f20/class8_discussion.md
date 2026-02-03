---
title: "ROB 502: Programming for Robotics: Class 8"
date: "2020-10-12"
---

## Clicker Questions

Use p4r-clicker to submit your answer

Assume we have the following code already defined for all the following questions:

```
typedef struct xy {
    double x;
    double y;
} xy_t;

typedef struct vector_xy {
    size_t size;
    size_t capacity;
    xy_t *data;
} vector_xy_t;
```

For each example, please either respond with "N" for no undefined behavior/memory errors/memory leaks, or the line number on which the first invalid memory access/undefined behavior happens (if it does) and the first memory leak happens (if it does), for at most two line numbers per example.

```
vector_xy_t create_vector_xy(void) { // line 1
    vector_xy_t vec = *malloc(sizeof(vec));
    vec.size = 0;
    vec.capacity = 4;
    vec.data = malloc(vec.capacity * sizeof(*vec.data));
    return vec;
}
void destroy_vector_xy(vector_xy_t *vec) { // line 8
    free(vec->data);
}
int main(void) { // line 11
    vector_xy_t v = create_vector_xy();
    destroy_vector_xy(&v);
}
```

The only error here is a memory leak on **line 2**: after allocating a pointer to enough memory for a `vector_xy_t`, we prompty dereference the pointer with `*` to get the value there, which happens to be undefined/random! That isn't a problem, because we set the values on lines 3-5, but in the process of dereferencing our pointer, we lose track of it! How will we be able to free the pointer we got from malloc? We can't because we don't have it anymore.

```
vector_xy_t *create_vector_xy(void) { // line 1
    vector_xy_t *vec = malloc(sizeof(vector_xy_t));
    vec->size = 0;
    vec->capacity = 4;
    vec->data = malloc(vec->capacity * sizeof(*vec->data));
    return vec;
}
void destroy_vector_xy(vector_xy_t *vec) { // line 8
    free(vec->data);
    free(vec);
}
int main(void) { // line 11
    vector_xy_t v = *create_vector_xy();
    destroy_vector_xy(&v);
}
```

This example is very similar, but the memory leak problem happens later, on **line 12**, when the pointer returned from `create_vector_xy` is dereferenced to store the value in `v`. Our vector `v` is a valid vector at this point, since it has all the same values as the one we malloc'ed, but by losing track of the original pointer, we have a memory leak. In addition, we also have an invalid free on **line 10** when we try to free the pointer that corresponds to our local variable `v` of main. Only pointers returned by malloc can be freed!

```
vector_xy_t create_vector_xy(void) { // line 1
    vector_xy_t vec = { 0 };
    vec.size = 0;
    vec.capacity = 4;
    vec.data = malloc(vec.capacity * sizeof(*vec.data));
    return vec;
}
void destroy_vector_xy(vector_xy_t *vec) { // line 8
    free(vec->data);
}
int main(void) { // line 11
    vector_xy_t v = create_vector_xy();
    destroy_vector_xy(&v);
}
```

**N**o errors here! This is an example of correctly creating a vector as a value `vector_xy_t`.

```
vector_xy_t *create_vector_xy(void) { // line 1
    vector_xy_t vec = { 0 };
    vec.size = 0;
    vec.capacity = 4;
    vec.data = malloc(vec.capacity * sizeof(*vec.data));
    return &vec;
}
void destroy_vector_xy(vector_xy_t *vec) { // line 8
    free(vec->data);
}
int main(void) { // line 11
    vector_xy_t *v = create_vector_xy();
    destroy_vector_xy(v);
}
```

The pointer we return on line 6 is to a local variable, and so that pointer will be invalid as soon as the `create_vector_xy` function returns. However, simply having an invalid pointer is not undefined behavior/an error unless we try to actually use it as a pointer. We do this on **line 9** when we finally try to access the field `data`. Since our pointer is not valid, this is undefined behavior and will likely crash.

```
vector_xy_t *create_vector_xy(void) { // line 1
    vector_xy_t *vec = malloc(sizeof(vector_xy_t));
    vec->size = 0;
    vec->capacity = 4;
    vec->data = malloc(vec->capacity * sizeof(*vec->data));
    return vec;
}
void destroy_vector_xy(vector_xy_t *vec) { // line 8
    free(vec->data);
    free(vec);
}
int main(void) { // line 12
    vector_xy_t *v = create_vector_xy();
    destroy_vector_xy(v);
}
```

**N**o errors here! This is an example of correctly creating a vector as heap-allocated `vector_xy_t` and returning the pointer to it.

```
vector_xy_t *create_vector_xy(void) { // line 1
    vector_xy_t *vec = malloc(sizeof(vec));
    vec->size = 0;
    vec->capacity = 4;
    vec->data = malloc(vec->capacity * sizeof(*vec->data));
    return vec;
}
void destroy_vector_xy(vector_xy_t *vec) { // line 8
    free(vec->data);
    free(vec);
}
int main(void) { // line 12
    vector_xy_t *v = create_vector_xy();
    destroy_vector_xy(v);
}
```

The source of the problem here is that on line 2 we use `sizeof(vec)` when `vec` is actually a pointer. The size of a pointer on 64-bit computers is 8 bytes, so we only allocate 8 bytes. The type of `vec->size` is `size_t`, which is an integer that is as large as a pointer, so it is also 8 bytes. This means that when we try to access `vec->capacity`, we must be beyond the 8 bytes we do have, and so we have a heap buffer overflow on **line 4**.
